import { screen, fireEvent } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';

const billTest = {
	id: '47qAXb6fIm2zOKkLzMro',
	vat: '80',
	fileUrl:
		'https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a',
	status: 'accepted',
	type: 'Hôtel et logement',
	commentAdmin: 'ok',
	commentary: 'séminaire billed',
	name: 'encore',
	fileName: 'preview-facture-free-201801-pdf-1.jpg',
	date: '2004-04-04',
	amount: 400,
	email: 'a@a',
	pct: 20,
};

const onNavigate = (pathname) => {
	document.body.innerHTML = ROUTES({ pathname });
};

const firestore = 'aa';

describe('Given I am connected as an employee', () => {
	describe('When I am on NewBill Page', () => {
		//	test('Then ...', () => {
		const html = NewBillUI();
		document.body.innerHTML = html;
		//to-do write assertion
		const form = screen.getByTestId('form-new-bill');
		const file = screen.getByTestId('file');

		const handleSubmit = jest.fn((e) => e.preventDefault());

		test('Then It should renders form New BIll', () => {
			form.addEventListener('submit', handleSubmit);
			fireEvent.submit(form);
			expect(screen.getByTestId('form-new-bill')).toBeTruthy();
		});
		test('Then It should submit the form', () => {
			const consoleSpy = jest.spyOn(console, 'log');

			console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value');

			form.addEventListener('submit', handleSubmit);
			fireEvent.submit(form);

			expect(handleSubmit).toHaveBeenCalled();
			expect(consoleSpy).toHaveBeenCalledWith(
				'e.target.querySelector(`input[data-testid="datepicker"]`).value',
			);
		});

		test('call the constructor', () => {
			const fileJPG = 'file.jpg';
			const handleChangeFile = jest.fn();
			file.addEventListener('change', handleChangeFile);
			const b = new NewBill({ document, onNavigate, firestore, localStorage });
			expect(b).toHaveProperty('document');
			expect(b).toHaveProperty('onNavigate');
			expect(screen.getByTestId('file')).toBeTruthy();
		});
	});
});

describe('When I download a file', () => {
	const html = NewBillUI();
	document.body.innerHTML = html;
	const c = new NewBill({ document, onNavigate, firestore, localStorage });
	const file = screen.getByTestId('file');
	const filer = 'file.nox';
	const handleChangeFile = jest.fn(() => {
		if (file.name.includes('jpg')) {
			return 'ok';
		} else {
			return 'abc';
		}
	});

	it('should be file pas jpg', () => {
		file.addEventListener('change', handleChangeFile);
		if (file.name.includes('jpg')) {
			expect(handleChangeFile).toHaveReturnedWith('azzbc');
		}
	});
});
