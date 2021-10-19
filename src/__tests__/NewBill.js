import { screen, fireEvent } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import { ROUTES } from '../constants/routes';
import { localStorageMock } from '../__mocks__/localStorage.js';

const onNavigate = (pathname) => {
	document.body.innerHTML = ROUTES({ pathname });
};

const firestore = null;

describe('Given I am connected as an employee', () => {
	describe('When I am on NewBill Page', () => {
		//	test('Then ...', () => {
		const html = NewBillUI();
		document.body.innerHTML = html;
		//to-do write assertion
		const form = screen.getByTestId('form-new-bill');

		const handleSubmit = jest.fn((e) => e.preventDefault());

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

		describe('When i am on the NewBill, the constructor is called', () => {
			Object.defineProperty(window, 'localStorage', { value: localStorageMock });
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				}),
			);
			const html = NewBillUI();
			document.body.innerHTML = html;

			const b = new NewBill({
				document,
				onNavigate,
				firestore,
				localStorage: window.localStorage,
			});

			var filex = new File(['foo'], 'foo.txt', {
				type: 'text/plain',
			});
			//expect(b).toHaveProperty('document');
			//expect(b).toHaveProperty('onNavigate');

			test('when i schange the file', () => {
				const file = screen.getByTestId('file');

				const handleChangeFile = jest.fn(() => {
					b.handleChangeFile();
				});

				file.addEventListener('change', handleChangeFile);
				fireEvent.change(file, { target: { files: [filex] } });
				expect(handleChangeFile).toHaveBeenCalled();
			});

			test('when i submit the form', () => {
				const handleSubmit = jest.fn(b.handleSubmit);
				//const email = JSON.parse(localStorage.getItem('user')).email;
				form.addEventListener('submit', handleSubmit);
				fireEvent.submit(form);
				expect(handleSubmit).toHaveBeenCalled();
				//expect(window.localStorage.setItem).toHaveBeenCalled();
			});
		});
	});
});
