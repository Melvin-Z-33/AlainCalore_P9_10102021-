import { screen, fireEvent } from '@testing-library/dom';

import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';

describe('Given I am connected as an employee', () => {
	describe('When I am on Bills Page', () => {
		it('should open new bill', () => {
			const html = BillsUI({ data: [] });
			document.body.innerHTML = html;
			expect(screen.getByTestId('btn-new-bill')).toBeTruthy();
		});

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
			// const antiChrono = (a, b) => ((a < b) ? 1 : -1)
			const antiChrono = (a, b) => b - a;

			//? TEST
			//	it('should be pqlinedep', () => {
			const datesSorted = [...dates].sort(antiChrono);
			const billsSorted = [...bills].sort(antiChrono);

			datesSorted.forEach((element) => {});
			expect(dates).toEqual(datesSorted);
			//expect(billsSorted).toEqual(datesSorted);
			//	});
		});
	});
});

// describe('class constructo call', () => {
// 	test('appeler le constructeur', () => {
// 		const fileJPG = 'file.jpg';
// 		const handleChangeFile = jest.fn();
// 		const onNavigate = (pathname) => {
// 			document.body.innerHTML = ROUTES({ pathname });
// 		};
// 		const firestore = 'aa';
// 		//file.addEventListener('change', handleChangeFile);
// 		const html = BillsUI({ data: [] });
// 		document.body.innerHTML = html;
// 		const b = new { document, onNavigate, firestore, localStorage }();
// 		expect(b).toHaveProperty('document');
// 		expect(b).toHaveProperty('onNavigate');

// 	});
// });

describe('When I click on button "New-Bil" ', () => {
	const html = BillsUI({ data: [] });
	document.body.innerHTML = html;

	const buttonNewBill = screen.getByTestId('btn-new-bill');
	const handleClickNewBill = jest.fn();

	it('should be launch function', () => {
		buttonNewBill.addEventListener('click', handleClickNewBill);

		fireEvent.click(buttonNewBill);
		expect(screen.getAllByText('Nouvelle note de frais')).toBeTruthy();
		//expect(handleClickNewBill).toHaveBeenCalledTimes(1);
	});
	it('should launch handleClickIconeeye', () => {
		const buttonEye = screen.getAllByTestId('icon-eye');
		const handleClickIconEye = jest.fn();

		buttonEye.forEach((element) => {
			element.addEventListener('click', handleClickIconEye);
			fireEvent.click(element);
			expect(handleClickIconEye).toHaveBeenCalled();
		});
	});
});
