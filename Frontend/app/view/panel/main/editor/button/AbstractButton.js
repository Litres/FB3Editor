/**
 * Абстрактная кнопка элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.AbstractButton',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.ButtonController'
		],

		controller: 'main.editor.button',
		
		afterRender: function ()
		{
			var me = this;
			
			me.callParent(arguments);
			
			// синхронизируем кнопку
			me.fireEvent('sync');
		}
	}
);