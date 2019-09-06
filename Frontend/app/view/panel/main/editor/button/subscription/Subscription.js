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
		
		xtype: 'main-editor-button-subscription',
		controller: 'main.editor.button.subscription',
		
		html: '<i class="fas fa-comments"></i>',

		tooltipText: 'Подпись',
		elementName: 'subscription'
	}
);