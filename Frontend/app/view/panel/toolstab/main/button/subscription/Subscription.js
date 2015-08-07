/**
 * Кнопка вставки subscription.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.subscription.Subscription',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.subscription.SubscriptionController'
		],
		id: 'panel-toolstab-main-button-subscription',
		xtype: 'panel-toolstab-main-button-subscription',
		controller: 'panel.toolstab.main.button.subscription',
		html: '<i class="fa fa-thumb-tack"></i>',
		tooltip: 'Подпись',
		elementName: 'subscription'
	}
);