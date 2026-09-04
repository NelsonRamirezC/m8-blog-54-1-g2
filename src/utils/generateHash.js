import bcrypt from "bcrypt";

const generateHash = async (password) => {

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    let passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;

}

export default generateHash;