/**
 * Кнотроллер корневого элемента описания (webkit).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.desc.AbstractRootElementControllerWebkit',
	{
		extend: 'FBEditor.editor.element.root.RootElementControllerWebkit',
		mixins: {
			controller: 'FBEditor.editor.element.desc.AbstractRootElementController'
		},

		onMouseUp: function (e)
		{
			var me = this;

			me.mixins.controller.onMouseUp.call(me, e);
		}
	}
);