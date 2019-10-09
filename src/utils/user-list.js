class UserList{
    constructor(){ this.list = []}

    addUser(userObj){
        if(!userObj.username || !userObj.room ){return{ error : 'username and room are reuired' }}   // Validating user input
        let username = userObj.username.trim().toLowerCase()
        let room     = userObj.room.trim().toLowerCase()
        if(!username || !room){return{ error : 'username and room are reuired' }}

        const exsistingUser = this.list.find( user=> user.username === username && user.room === room )                  // checking if the username is take 
        if(exsistingUser){ return {error : 'usrname is in use' }}

        let userEntry = { id: userObj.id, username, room };                                        // saving user                                                
        this.list.push(userEntry)
        return {user: userEntry};
    }

    removeUser(id){
        const userIndex = this.list.findIndex(user=> user.id ===id)
        if(userIndex === -1){
            return undefined
        }
        return this.list.splice(userIndex,1)[0]
    }

    getUser(id){
        return this.users.find(user=> user.id === id)
    }

    userList(room){
        room = room.trim().toLowerCase()
        return this.list.filter(user=> user.room === room )
    }
}

let users = new UserList();

module.exports = users;
