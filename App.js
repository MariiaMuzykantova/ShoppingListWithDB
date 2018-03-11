import React from 'react';
import {StyleSheet, Text, TextInput, View, Button, FlatList, Alert} from 'react-native';
import Expo, { SQLite } from 'expo';

const db = SQLite.openDatabase('shoppinglistdb.db');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {product: '', amount: '', shoppinglist: []};
  }

  componentDidMount() {
    // Create shoppinglist table
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, products int, amount text);');
    });
    this.updateList();
  }

  // Save shoppinglist
  saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shoppinglist (products, amount) values (?, ?)', [parseInt(this.state.product), this.state.amount]);    
      }, null, this.updateList)
  }

  // Update shoppinglistlist
  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist', [], (_, { rows }) =>
        this.setState({shoppinglist: rows._array})
      ); 
    });
  }

  // Delete shoppinglist
  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
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

  render() {
    return (  
      <View style={styles.container}>
        <TextInput placeholder='amount' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(amount) => this.setState({amount})}
          value={this.state.amount}/>  
        <TextInput placeholder='products' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(product) => this.setState({product})}
          value={this.state.product}/>      
        <Button onPress={this.saveItem} title="Save" /> 
        <Text style={{marginTop: 30, fontSize: 20}}>shoppinglist</Text>
        <FlatList 
          style={{marginLeft : "5%"}}
          keyExtractor={item => item.id} 
          renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.amount}, {item.products}   </Text>
          <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => this.deleteItem(item.id)}>bought</Text></View>} data={this.state.shoppinglist} ItemSeparatorComponent={this.listSeparator} 
        />      
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