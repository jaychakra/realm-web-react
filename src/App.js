import React from "react";
import "./styles.css";

// Import the MongoDB Realm Web SDK
import * as Realm from "realm-web";

// Connect to your MongoDB Realm app
const REALM_APP_ID = "websdk_watch-jxuke"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });
// const mongodb = app.services.mongodb("mongodb-atlas");
// console.log(app);


// const collection = mongodb.db("websdk_watch").collection("demo");
// Create a component that displays the given user's detail
function UserDetail({ user }) {
  return (
    <div>
      <h1>Logged in with anonymous id: {JSON.stringify(user.id)}</h1>
    </div>
  );
}

// Create a component that lets an anonymous user log in
function Login({ setUser }) {
  const loginAnonymous = async () => {
    const user = await app.logIn(Realm.Credentials.emailPassword("root@google.com", "123456"));
    setUser(user);
  };
  return <button onClick={loginAnonymous}>Log In</button>;
}


const View = ({data}) => {
    console.log(data);
    return <li>{data}</li>
}
const watcher = async (collection) => {
    for await (const change of collection.watch()) {
        console.log(change);
        // const {operationType} = change;
        // switch (operationType) {
        //     case "insert": {
        //         const {documentKey, fullDocument} = change;
        //         console.log(`new document: ${documentKey}`, fullDocument);
        //         break;
        //     }
        //     case "update": {
        //         const {documentKey, fullDocument} = change;
        //         console.log(`updated document: ${documentKey}`, fullDocument);
        //         break;
        //     }
        //     case "replace": {
        //         const {documentKey, fullDocument} = change;
        //         console.log(`replaced document: ${documentKey}`, fullDocument);
        //         break;
        //     }
        //     case "delete": {
        //         const {documentKey} = change;
        //         console.log(`deleted document: ${documentKey}`);
        //         break;
        //     }
        // }
    }
}

class App extends React.Component {

    state = {
        user: null,
        data: [],
        isLoggedIn: false,
        collection: null
    }

    componentDidMount() {
        app.logIn(Realm.Credentials.emailPassword("root@google.com", "123456"))
            .then((user) => {
                this.setUser(user);
            })
            .then(() => {
                const mongodb = app.currentUser.mongoClient("mongodb-atlas");
                const collection = mongodb.db("websdk_watch").collection("demo");
                this.setState({collection});
                collection.find().then(data => this.setState({data}))
                watcher(collection);
            });
    }

    setUser = (user) => {
        this.setState({user, isLoggedIn: true});
    }

    render() {
        const {user, isLoggedIn, data} = this.state;
        // console.log("data", data);
        let string = data.map(d => <View data={`${d.name} on partition ${d._partition}`} />);
        return (
            <div className="App">
                <div className="App-header">
                    {isLoggedIn ? <UserDetail user={user}  /> : <Login setUser={this.setUser} />}

                </div>
                <div>
                    {string}
                </div>
            </div>
        );
    }
}

export default App;
