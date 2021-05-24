/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import {openDatabase, DEBUG, enablePromise} from "react-native-sqlite-storage";

import React, { useEffect, useState } from 'react';
// import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [database, setDatabase] = useState();
  //Todo : workflow
  DEBUG(true);
  
  useEffect(() => {
    asyncCreate();
    return () => {
      console.log("db might not be open")
    }
  }, [])

  // enablePromise(true);
  const asyncCreate = async () => {

    const db = await openDatabase({
      name: "TestDatabase",
      location: "default"
    }
    );
    db.transaction(
      transaction => {

        transaction.executeSql(`
        CREATE TABLE IF NOT EXISTS User(
          id INTEGER PRIMARY KEY NOT NULL,
          name VARCHAR(40),
          description TEXT,
          password TEXT
          );
          `, [], (a, b) => console.log("success :",b), (a, b) => console.log("err :",b));
          
          console.log("User table created.")
          setDatabase(db);
          console.log("Database object assigned to state.");
          
        }
      )
        }
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const logResults = (resultSet) => {

    for (let i = 0; i<resultSet.rows.length; i++) {
      console.log(i, '=>', resultSet.rows.item(i))
    }
  }
    const method1 = () => database.transaction( // Output is unreadable  ("���������");
    tx => tx.executeSql('INSERT INTO User (name, description) VALUES (?, ?);', ['John Doe', 'method 1 inspirational description'], (tx, resultSet) => console.log("result : ", resultSet, tx), (a, b) => console.log("error :", a, b) )
  );
  const method2 = () => database.transaction(
    tx => tx.executeSql(`INSERT INTO User (name, description) VALUES ('John Doe', 'method 2 inspirational description');`, [], (tx, resultSet) => console.log("result : ", resultSet, tx), (a, b) => console.log("error :", a, b) )
  );
  const method3 = () => database.transaction(
    tx => tx.executeSql(`INSERT INTO User (name, description) VALUES ("JohnDoe", "method3inspirationaldescription");`, [], (tx, resultSet) => console.log("result : ", resultSet, tx), (a, b) => console.log("error :", a, b) )
  );
  const method4 = () => database.transaction( //Does not work; throws error "no such column : JohnDoe"
    tx => tx.executeSql(`INSERT INTO User (name, description) VALUES (JohnDoe, method4inspirationaldescription);`, [], (tx, resultSet) => console.log("result : ", resultSet, tx), (a, b) => console.log("error :", a, b) )
  );
  const Logging = () =>database.transaction(
    tx => tx.executeSql(`SELECT * FROM User ORDER BY id ASC;`,[], (tx, resultSet) => logResults(resultSet), (a, b) => console.log("error :", a, b)));


  return (
    <SafeAreaView style={backgroundStyle}>
      
      <Button
      disabled={!!!database}
      title="Add (method 1)"
      onPress={method1}
      color={"black"}
      />
      
      <Button
      disabled={!!!database}

      title="Add (method 2)"

      onPress={method2}
      color={"black"}
      />

      <Button
      disabled={!!!database}

      title="Add (method 3)"

      onPress={method3}
      color={"black"}
      />
    

    <Button
      disabled={!!!database}

      title="Add (method 4)"

      onPress={method4}
      color={"black"}
      />

      <Button
      disabled={!!!database}

      title="Log data (select all)"

      onPress={Logging}
      color={"black"}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
