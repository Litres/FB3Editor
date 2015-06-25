/**
 * Элемент subscription.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.subscription.SubscriptionElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.subscription.CreateCommand',
			'FBEditor.editor.element.subscription.SubscriptionElementController'
		],
		controllerClass: 'FBEditor.editor.element.subscription.SubscriptionElementController',
		htmlTag: 'subscription',
		xmlTag: 'subscription',
		cls: 'el-subscription',

		isSubscription: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Подпись');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);