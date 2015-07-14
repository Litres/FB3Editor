/**
 * Абстрактная кнопка элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.AbstractButton',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.ButtonController'
		],
		controller: 'panel.toolstab.main.button',

		listeners: {
			click: 'onClick',
			sync: 'onSync'
		},

		initComponent: function ()
		{
			var me = this,
				manager = FBEditor.editor.Manager;

			me.callParent(arguments);

			manager.addButtons(me);
		}
	}
);