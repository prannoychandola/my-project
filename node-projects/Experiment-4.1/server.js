const readline = require('readline');

const staff = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mainMenu() {
  console.log('\nEmployee Management System');
  console.log('1) Add employee');
  console.log('2) Show employees');
  console.log('3) Remove employee');
  console.log('4) Quit\n');

  rl.question('Enter your choice: ', choice => {
    switch (choice.trim()) {
      case '1':
        return addEmployee();
      case '2':
        return listEmployees();
      case '3':
        return removeEmployee();
      case '4':
        return exitApp();
      default:
        console.log('Invalid option, try again.');
        return mainMenu();
    }
  });
}

function addEmployee() {
  rl.question('Enter employee name: ', name => {
    if (!name.trim()) {
      console.log('Name cannot be empty.');
      return mainMenu();
    }
    rl.question('Enter employee ID: ', id => {
      id = id.trim();
      if (!id) {
        console.log('ID cannot be empty.');
        return mainMenu();
      }
      if (staff.some(e => e.id === id)) {
        console.log(`Employee with ID ${id} already exists.`);
        return mainMenu();
      }
      staff.push({ name: name.trim(), id });
      console.log(`Employee ${name.trim()} (ID: ${id}) added successfully.`);
      mainMenu();
    });
  });
}

function listEmployees() {
  if (staff.length === 0) {
    console.log('\nNo employees to show.');
  } else {
    console.log('\nEmployee List:');
    staff.forEach((e, i) => {
      console.log(`${i + 1}. Name: ${e.name}, ID: ${e.id}`);
    });
  }
  mainMenu();
}

function removeEmployee() {
  rl.question('Enter employee ID to remove: ', id => {
    id = id.trim();
    const idx = staff.findIndex(e => e.id === id);
    if (idx === -1) {
      console.log(`Employee with ID ${id} not found.`);
    } else {
      const removed = staff.splice(idx, 1)[0];
      console.log(`Employee ${removed.name} (ID: ${removed.id}) removed successfully.`);
    }
    mainMenu();
  });
}

function exitApp() {
  rl.close();
}

rl.on('close', () => process.exit(0));

mainMenu()
