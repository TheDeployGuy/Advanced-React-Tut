const Mutations = {
    createDog(parent, args, ctx, info) {
        // Create a dog
        global.dogs = global.dog || []
        const newDog = { name: args.name };
        global.dogs.push(newDog);
        return newDog;
    }
};

module.exports = Mutations;
