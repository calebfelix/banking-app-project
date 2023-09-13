const Account = require("./Account");
const User = require("./components/user/service/User");

admin = User.newAdmin("caleb", 3, "m", "admin", "password");
user1 = admin1.newUser("u1", 22, "m", "u1", "password");
user2 = admin1.newUser("u2", 25, "f","u2", "password");

admin1.getAllUsers();
admin1.updateUser(1, "name", "caleb Updated");
admin1.getAllUsers();

admin1.newBank("indian bank");
admin1.newBank("Axis Bank");
admin1.newBank("Maharashtra Bank");
admin1.newBank("bank of Hydrabad");

admin1.updateBank(103, "bankName", "bank of AndraPradesh");
user1.newAccount(100);
user1.newAccount(101);
user2.newAccount(101);
user1.getAccounts();

console.log(user2.getAccounts());
console.log(admin1.getAllBanks());
user2.deposite(1000002, 100);
user2.withdraw(1000002, 2);
user2.withdraw(1000002, 20);
console.log(Account.allAccounts);
console.log(user2.transfer(1000002, 1000001, 40));
console.log(user1.transfer(1000001, 1000000, 5));
admin1.getAllBanks();
user2.getAccounts();
console.log(Account.allAccounts);

console.log(user2.getAccountTransactionsByDate(1000002, "1/8/2023", "4/9/2023"));
console.log(user2.getAccountTransactionsByDate(1000002, "1/8/2023", "4/9/2023"));
console.log(user2.getAccountTransactionsByDate(1000002, "", "2/9/2023"));
console.log(user2.getAccountTransactionsByDate(1000002, "1/8/2023", ""));
console.log(admin1.getAllBanks());
console.log(user1.getNetWorth());
// console.log(admin1.getBankToPay(101, "1/8/2023", "2/9/2023"));
