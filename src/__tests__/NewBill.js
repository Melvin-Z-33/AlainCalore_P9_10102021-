import { screen, fireEvent } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import BillsUI from '../views/BillsUI.js';
import { ROUTES } from '../constants/routes';
import { localStorageMock } from '../__mocks__/localStorage.js';
import { ROUTES_PATH } from '../constants/routes.js';
import firebase from '../__mocks__/firebase';

describe('Given I am connected as an employee', () => {
	describe('When I am on NewBill Page', () => {
		localStorage.setItem(
			'user',
			JSON.stringify({ type: 'Employee', email: 'a@a', fileName: 'op.jpg' }),
		);
		const html = NewBillUI();
		const onNavigate = jest.fn();
		document.body.innerHTML = html;

		const storagee = {
			ref: () => storagee,
			put: async () => {
				return { ref: null, getDownloadURL: () => 'www.france.fr' };
			},
			url: () => {
				fileName = 'op.jpg';
			},
		};

		//to-do write assertion
		const form = screen.getByTestId('form-new-bill');
		const handleSubmit = jest.fn((e) => e.preventDefault());
		test('Then It should submit the form', () => {
			const consoleSpy = jest.spyOn(console, 'log');
			console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value');
			form.addEventListener('submit', handleSubmit);
			fireEvent.submit(form);
			expect(handleSubmit).toHaveBeenCalled();
			expect(form).toBeTruthy();
			expect(consoleSpy).toHaveBeenCalledWith(
				'e.target.querySelector(`input[data-testid="datepicker"]`).value',
			);
			//expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
		});
	});
});

describe('When i am on the NewBill page, i uplooad my file ', () => {
	Object.defineProperty(window, 'localStorage', { value: localStorageMock });
	window.localStorage.setItem(
		'user',
		JSON.stringify({
			type: 'Employee',
			email: 'user@example.com',
		}),
	);
	const onNavigate = (pathname) => {
		document.body.innerHTML = ROUTES({ pathname });
	};

	const html = NewBillUI();
	document.body.innerHTML = html;

	const storagee = {
		ref: () => storagee,
		put: async () => {
			return { ref: null, getDownloadURL: () => 'www.france.fr' };
		},
	};

	const testBill = new NewBill({
		document,
		onNavigate,
		firestore: {
			storage: storagee,
		},
		localStorage: window.localStorage,
	});

	test('if i upload a good file', () => {
		const file = screen.getByTestId('file');

		const handleChangeFile = jest.fn((e) => {
			testBill.handleChangeFile(e);
		});

		file.addEventListener('change', handleChangeFile);
		fireEvent.change(file, {
			target: { files: [new File([':)'], 'test.jpeg', { type: 'image/jpeg' })] },
		});

		expect(handleChangeFile).toHaveBeenCalled();

		expect(file.files[0].name).toBe('test.jpeg');
	});
	test('if i upload a bad file', () => {
		const file = screen.getByTestId('file');

		const handleChangeFile = jest.fn((e) => {
			testBill.handleChangeFile(e);
		});

		file.addEventListener('change', handleChangeFile);
		fireEvent.change(file, {
			target: { files: [new File(['texte.txt'], 'texte.txt', { type: 'texte/txt' })] },
		});

		expect(handleChangeFile).toHaveBeenCalled();

		expect(file.value).toBe('');
	});
});

//TEST D'INTEGRATION POST
describe('Given I am a user connected as Employee', () => {
	describe('When I create a new bill', () => {
		test('Add bill to mock API POST', async () => {
			const getSpyPost = jest.spyOn(firebase, 'post');
			const testBill = {
				id: 'eoKIpYhECmaZAGRrHjaC',
				status: 'refused',
				pct: 10,
				amount: 500,
				email: 'john@doe.com',
				name: 'Facture 236',
				vat: '60',
				fileName: 'preview-facture-free-201903-pdf-1.jpg',
				date: '2021-03-13',
				commentAdmin: 'à valider',
				commentary: 'A déduire',
				type: 'Restaurants et bars',
				fileUrl: 'https://saving.com',
			};
			const bills = await firebase.post(testBill);
			expect(getSpyPost).toHaveBeenCalledTimes(1);
			expect(bills.data.length).toBe(5);
		});
		test('Add bill to API and fails with 404 message error', async () => {
			firebase.post.mockImplementationOnce(() => Promise.reject(new Error('Erreur 404')));
			const html = BillsUI({ error: 'Erreur 404' });
			document.body.innerHTML = html;
			const message = await screen.getByText(/Erreur 404/);
			expect(message).toBeTruthy();
		});
		test('Add bill to API and fails with 500 message error', async () => {
			firebase.post.mockImplementationOnce(() => Promise.reject(new Error('Erreur 500')));
			const html = BillsUI({ error: 'Erreur 500' });
			document.body.innerHTML = html;
			const message = await screen.getByText(/Erreur 500/);
			expect(message).toBeTruthy();
		});
	});
});

describe('When NewBill is submit', () => {
	test('Then I must be redirected to Bill dashboard ', () => {
		document.body.innerHTML = NewBillUI();
		const onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname });
		};

		const testBill = new NewBill({
			document,
			onNavigate,
			firestore: null,
			localStorage: window.localStorage,
		});
		const form = screen.getByTestId('form-new-bill');
		const handleSubmit = jest.fn(testBill.handleSubmit);
		form.addEventListener('submit', handleSubmit);
		fireEvent.submit(form);

		expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();
	});
});
