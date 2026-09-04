import bcrypt from "bcrypt";

const saltRounds = 12;
const password = '123456';


const salt = await bcrypt.genSalt(saltRounds);
console.log(salt);

console.time()
let passwordHash = await bcrypt.hash(password, salt);
console.timeEnd();
console.log("hash", passwordHash)

let coincide = await bcrypt.compare("123456", passwordHash);

console.log(coincide);
