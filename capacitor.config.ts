import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'NotifyMeApp',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample", // icone da notificação
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
