import { createStackNavigator, createAppContainer  } from 'react-navigation'
import TabBarIcon from '../screens/TabBarIcon'
import MyScreen from '../screens/MyScreen'
import SettingsScreen from '../screens/SettingsScreen'
import HomeScreen from '../screens/HomeScreen'



const TabNavigator = createBottomTabNavigator({
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
  {
    initialRouteName: "Home"
  });

  export default createAppContainer(TabNavigator ) 