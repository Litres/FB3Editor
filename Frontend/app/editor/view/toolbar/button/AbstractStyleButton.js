/**
 * Абстрактная кнопка создания стилевого элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.AbstractStyleButton',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractToggleButton',

		isActiveSelection: function ()
		{
			var me = this,
				manager = me.getEditorManager(),
				res,
				range;

			range = manager.getRange();
			res = !range.collapsed;

			return res;
		}
	}
);