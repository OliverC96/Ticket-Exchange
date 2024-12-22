import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Number of salt rounds
const SALT_FACTOR = 10;

export enum AuthMethod {
    Native = "native",
    Google = "google",
    GitHub = "github",
}

// Describes the fields/properties required to create a new user document
interface UserFields {
    email: string;
    password: string;
    auth_method?: AuthMethod;
}

// Describes the fields/properties of a user model
interface UserModel extends mongoose.Model<UserDocument> {
    build(fields: UserFields): UserDocument;
}

// Describes the fields/properties of a single user document
interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    auth_method?: AuthMethod;
    validatePassword(password: string): Promise<boolean>;
}

// Defining the schema for the user model
const userSchema: mongoose.Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    auth_method: {
        type: String,
        required: false,
        enum: Object.values(AuthMethod),
        default: AuthMethod.Native
    }
});

/**
 * Defining a function to format/map JSON properties (standardizing field names, customizing response object)
 */
userSchema.set("toJSON", {
    transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret.id;
        delete ret.password;
        delete ret.__v;
    }
});

/**
 * Implementing a pre hook to execute before saving or updating a document in the users database
 * The specified callback hashes the plaintext password (using bcrypt) if the password field has been modified
 */
userSchema.pre(["save", "updateOne", "findOneAndUpdate"], async function (next) {
    const thisDocument = this as UserDocument;
    if (!thisDocument.isModified("password")) {
        return next();
    }
    const saltSequence = await bcrypt.genSalt(SALT_FACTOR);
    thisDocument.password = await bcrypt.hash(thisDocument.password, saltSequence);
});

/**
 * Adding a static method to the user model (TypeScript workaround)
 * @param fields The parameters of the new document
 * @return The newly created document
 */
userSchema.statics.build = (fields: UserFields) => {
    return new User(fields);
}

/**
 * Adding an instance method to the user model which determines whether the given password is valid
 * @param password The candidate password
 * @return true, if the specified password is valid, false otherwise
 */
userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}

export const User: UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);