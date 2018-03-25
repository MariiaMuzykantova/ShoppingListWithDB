import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, Alert, Dimensions } from 'react-native';
import Expo, { SQLite } from 'expo';
import { FormLabel, FormInput, Button, List, ListItem, Card } from 'react-native-elements';

const db = SQLite.openDatabase('shoppingdb.db');
const width = Dimensions.get("window").width;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: '', amount: '', shoppingList: []
    }
  }

 
    // Create shopping table
    componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, product text, amount int);');
    });
    this.updateList();

  }

  // Save shopping
  saveItem = () => {
    console.log(this.state)
    db.transaction(tx => {
      tx.executeSql('insert into shopping (product, amount) values (?, ?)', [this.state.product, parseInt(this.state.amount)]);
    }, null, this.updateList)    
  }

  // Update shoppinglist
  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shopping', [], (_, { rows }) => 
        this.setState({ shoppingList: rows._array })
      );
    });
    console.log('update', this.state.shoppingList)
  }

  // Delete shopping
  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shopping where id = ?;`, [id]);
      }, null, this.updateList
    )
  }

  listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  renderListProducts = () => {
   const shoppingList2 = this.state.shoppingList.map((value, index) => { 
      return ( <ListItem
       
        subtitle={value.amount}
        title={value.product}
        key={index}
        rightTitle="bought" 
        onPress={() => this.deleteItem(value.id)}
      />
    )
    })
    return shoppingList2
  }
  render() {
    console.log(this.state)
    return (
      <View style={styles.container}>
      <Card title="Shopping list" style={{backgroundColor: '#9999ff'}} >
        <FormLabel>Product</FormLabel>
        <FormInput placeholder='type product' style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(product) => this.setState({ product })}
          value={this.state.product} />
        <FormLabel>Amount</FormLabel>
        <FormInput placeholder='type amount' style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(amount) => this.setState({ amount })}
          value={this.state.amount} />
        <Button buttonStyle={{paddingLeft: 150, paddingRight: 150}} raised onPress={this.saveItem} title="Save" />
        </Card>
        <Text style={{ marginTop: 20, fontSize: 20 }}>My shopping list</Text>
       

        <List containerStyle={{ width, marginBottom: 20 }}>
          {
            this.renderListProducts()
          }
          
        </List>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  }
});