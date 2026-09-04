import bcrypt from "bcrypt";

const compareHash = async  (password, passwordHash) => {

    let coincide = await bcrypt.compare(password, passwordHash);

    return coincide;
}

export default compareHash;

