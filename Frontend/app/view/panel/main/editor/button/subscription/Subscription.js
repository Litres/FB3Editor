/**
 * Кнопка вставки subscription.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.subscription.Subscription',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.subscription.SubscriptionController'
		],
		id: 'main-editor-button-subscription',
		xtype: 'main-editor-button-subscription',
		controller: 'main.editor.button.subscription',
		html: '<i class="fa fa-thumb-tack"></i>',
		tooltip: 'Подпись',
		elementName: 'subscription'
	}
);