import { useNavigation } from "@react-navigation/core";
import React from "react";
import * as api from '../api/clients';

const ClientsList = () => {
    const [clientsList, setclientsList] = useState(null);
        
    try {
        const {loadclientsList, setclientsList} = await api.get_clients();
        console.log(`error: ${error}`);
        console.log(`clients: ${clients}`);
        if (error) {
            setMessage({ type: "error", text: error });
        } else {
            console.log("tengo el clientse")
        }
    } catch (err) {
        setMessage({ type: "error", text: err.toString() });
    }

    useEffect(() => {
      loadclientsList();
    }, []);
  
    if (clientsList === null) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="skyblue" />
        </View>
      );
    }
    return (
      <FlatList
        data={clientsList}
        renderItem={({ item }) => <User user={item} />}
        keyExtractor={(item) => item.login.uuid}
        ItemSeparatorComponent={Separator}
      />
    );
  };
  
  export default ClientsList;

