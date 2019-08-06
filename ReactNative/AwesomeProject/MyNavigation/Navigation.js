import { createStackNavigator, createAppContainer  } from 'react-navigation'
import TabBarIcon from '../components/TabBarIcon'
import MyScreen from '../components/MyScreen'
import DetailsScreen from '../components/DetailsScreen'
import HomeScreen from '../components/HomeScreen'


const AppNavigator = createStackNavigator(
  {
    Home: { // Ici j'ai appelé la vue "Search" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
      screen: HomeScreen
    }

  },
  {
    initialRouteName: "Home"
  }
);



export default createAppContainer(AppNavigator)