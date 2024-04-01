import { Component } from '@angular/core';
import { LocalNotificationActionPerformed, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private alertCtrl: AlertController) { }

  async ngOnInit() {
    await this.requestNotificationPermission(); // solicitação de permissão ao inicializar a página

    LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'CHAT_MSG',
          actions: [
            // {
            //   id: 'view',
            //   title: 'Abrir chat'
            // },
            {
              id: 'respond',
              title: 'Responder',
              input: true
            },
            {
              id: 'remove',
              title: 'Fechar',
              destructive: true
            }
          ]
        }
      ]
    });

    LocalNotifications.addListener('localNotificationReceived', (notification: LocalNotificationSchema) => {
      this.presentAlert(`Received: ${notification.title}`, `Custom Data: ${JSON.stringify(notification.extra)}`);
    });

    LocalNotifications.addListener('localNotificationActionPerformed', async (notification: LocalNotificationActionPerformed) => {
      if (notification.actionId === 'view') {
        this.presentAlert('Abrir chat', 'Você clicou em abrir chat.');
      } else if (notification.actionId === 'respond') {
        const prompt = await this.alertCtrl.create({
          header: 'Responder',
          inputs: [
            {
              name: 'message',
              type: 'text',
              placeholder: 'Digite sua mensagem'
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Enviar',
              handler: (data) => {
                const message = data.message;
                this.presentAlert('Mensagem enviada', `Sua mensagem: ${message}`);
              }
            }
          ]
        });

        await prompt.present();
      }
    });
  }

  async scheduleBasic() {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Lembrete básico',
            body: 'Mensagem do lembrete',
            id: 1,
            extra: {
              data: 'Passe dados para seu manipulador'
            },
            iconColor: '#118AB2'
          }
        ]
      });
      this.presentAlert('Sucesso', 'Notificação recebida.');
    } catch (error) {
      this.presentAlert('Erro', 'Não foi possível agendar a notificação. Verifique as permissões.');
    }
  }

  async scheduleAdvanced() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Lembrete avançado',
          body: 'Mensagem do lembrete',
          id: 2,
          extra: {
            data: 'Passe dados para seu manipulador'
          },
          iconColor: '#0000FF',
          actionTypeId: 'CHAT_MSG',
          attachments: [
            {
              id: 'face', url: 'assets/ionic.png' //imagem que deve aparecer na notificação
            }
          ],
          schedule: {
            at: new Date(Date.now() + 1000 * 3) // agendar notificação para 3 segundos no futuro
          },
        }
      ]
    })
  }

  async requestNotificationPermission() {
    try {
      // solicitação de permissão ao usuário
      const permissionStatus = await LocalNotifications.requestPermissions();
      if (!permissionStatus.display || permissionStatus.display !== 'granted') {
        throw new Error('Permissão não concedida');
      }
    } catch (error) {
      this.presentAlert('Erro', 'Não foi possível obter permissão para notificações.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
