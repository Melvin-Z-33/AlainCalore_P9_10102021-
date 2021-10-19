import { screen, fireEvent } from '@testing-library/dom';
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import Bills from '../containers/Bills.js';
import NewBill from '../containers/NewBill.js';
import NewBillUI from '../views/NewBillUI.js';
import { ROUTES } from '../constants/routes';
import Logout from '../containers/Logout.js';
import '@testing-library/jest-dom/extend-expect';
import { localStorageMock } from '../__mocks__/localStorage.js';
import userEvent from '@testing-library/user-event';

import { ROUTES_PATH } from '../constants/routes.js';
import { formatDate, formatStatus } from '../app/format.js';

import firebase from '../__mocks__/firebase';

import DashboardFormUI from '../views/DashboardFormUI.js';
import DashboardUI from '../views/DashboardUI.js';
import Dashboard, { filteredBills, cards } from '../containers/Dashboard.js';

describe('Given I am connected as an employee', () => {
	describe('When I am on Bills Page', () => {
		test('Then bill icon in vertical layout should be highlighted', () => {
			const html = BillsUI({ data: [] });
			document.body.innerHTML = html;
			//to-do write expect expression
		});
		test('Then bills should be ordered from earliest to latest', () => {
			const html = BillsUI({ data: bills });
			document.body.innerHTML = html;
			const dates = screen
				.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
				.map((a) => a.innerHTML);
			const antiChrono = (a, b) => b - a;
			const datesSorted = [...dates].sort(antiChrono);
			expect(dates).toEqual(datesSorted);
		});
	});
});

//!Test new bill
describe('Given I am connected as Admin and I am on Dashboard page and I clicked on a bill', () => {
	describe('When I click on the button "New Bills"', () => {
		Object.defineProperty(window, 'localStorage', { value: localStorageMock });
		const user = JSON.stringify({
			type: 'Employee',
		});
		window.localStorage.setItem('user', user);

		const html = BillsUI({ data: bills });
		document.body.innerHTML = html;
		const onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname });
		};
		const firestore = null;
		const newBillx = new Bills({
			document,
			onNavigate,
			firestore,
			localStorage: window.localStorage,
		});
		test('A New Form  open', () => {
			const handleClickNewBill = jest.fn((e) => {
				newBillx.handleClickNewBill;
			});
			const routes = jest.fn((icon) => {});

			const buttonNewBill = screen.getByTestId('btn-new-bill');
			buttonNewBill.addEventListener('click', handleClickNewBill);
			userEvent.click(buttonNewBill);
			expect(handleClickNewBill).toHaveBeenCalled();
			//modaleFileEmployee
			const modale = screen.getByTestId('modaleFileEmployee');
			expect(modale).toBeTruthy();
		});

		test('should open à modal', () => {
			const eye = screen.getAllByTestId('icon-eye');
			eye.forEach((icon) => {
				const handleClickIconEye = jest.fn((icon) => {
					newBillx.handleClickIconEye;
				});
				icon.addEventListener('click', handleClickIconEye);

				userEvent.click(icon);
				expect(handleClickIconEye).toHaveBeenCalled();
				//expect(billUrl).toEqual(icon.getAttribute('data-bill-url'));
			});
		});
	});
});
