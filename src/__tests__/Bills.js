import { screen } from '@testing-library/dom';
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import Bills from '../containers/Bills.js';
import { ROUTES } from '../constants/routes';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Router from '../app/Router';
import Firestore from '../app/Firestore';
import { ROUTES_PATH } from '../constants/routes.js';
import firebase from '../__mocks__/firebase';

describe('Given I am connected as an employee', () => {
	describe('When I am on Bills Page', () => {
		test('Then bill icon in vertical layout should be highlighted', () => {
			const html = BillsUI({ data: [] });
			document.body.innerHTML = html;
			//to-do write expect expression
			// ** Mock - parameters for bdd Firebase & data fetching **
			jest.mock('../app/Firestore');
			Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() });

			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				}),
			);
			// ** Routing variable **
			const pathname = ROUTES_PATH['Bills'];

			// ** build div DOM **
			Object.defineProperty(window, 'location', { value: { hash: pathname } });
			document.body.innerHTML = `<div id="root"></div>`;

			// ** Router init to get actives CSS classes **
			Router();

			expect(screen.getByTestId('icon-window').classList.contains('active-icon')).toBe(true);
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

describe('When i click on an icon eye of a bill', () => {
	test('Then a modal should open', () => {
		document.body.innerHTML = BillsUI({ data: bills });
		const testBills = new Bills({
			document,
			onNavigate,
			firestore: null,
			localStorage: window.localStorage,
		});
		const handleClickIconEye = jest.fn(testBills.handleClickIconEye);

		// ** Mock modal comportment **
		$.fn.modal = jest.fn();
		const eye = screen.getAllByTestId('icon-eye');
		eye[0].addEventListener('click', handleClickIconEye(eye[0]));
		userEvent.click(eye[0]);
		expect(handleClickIconEye).toHaveBeenCalled();
		const modale = document.getElementById('modaleFile');
		expect(modale).toBeTruthy();
	});
});

describe('When I click on new bill button', () => {
	test('Then, I should be sent to new bill page', () => {
		const onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname });
		};
		document.body.innerHTML = BillsUI({ data: bills });
		const bill = new Bills({ document, onNavigate, localStorage });
		const handleClick = jest.fn(bill.handleClickNewBill);
		const btnNewBill = screen.getByTestId('btn-new-bill');
		btnNewBill.addEventListener('click', handleClick);
		userEvent.click(btnNewBill);
		expect(handleClick).toHaveBeenCalled();
		expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
	});
});

// test d'intégration GET
describe('Given I am a user connected as Employee', () => {
	describe('When I navigate to Bill', () => {
		test('fetches bills from mock API GET', async () => {
			const getSpy = jest.spyOn(firebase, 'get');
			const bills = await firebase.get();
			expect(getSpy).toHaveBeenCalledTimes(1);
			expect(bills.data.length).toBe(4);
		});
		test('fetches bills from an API and fails with 404 message error', async () => {
			firebase.get.mockImplementationOnce(() => Promise.reject(new Error('Erreur 404')));
			const html = BillsUI({ error: 'Erreur 404' });
			document.body.innerHTML = html;
			const message = await screen.getByText(/Erreur 404/);
			expect(message).toBeTruthy();
		});
		test('fetches messages from an API and fails with 500 message error', async () => {
			firebase.get.mockImplementationOnce(() => Promise.reject(new Error('Erreur 500')));
			const html = BillsUI({ error: 'Erreur 500' });
			document.body.innerHTML = html;
			const message = await screen.getByText(/Erreur 500/);
			expect(message).toBeTruthy();
		});
	});
});
