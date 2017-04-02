/**
 * Контроллер элемента li для webkit.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.li.LiElementControllerWebKit',
	{
		extend: 'FBEditor.editor.element.AbstractStyleHolderElementControllerWebKit',
		mixins: {
			controller: 'FBEditor.editor.element.li.LiElementController'
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				el = me.el;

			me.mixins.controller.onKeyDownBackspace.apply(me, arguments);
		}
	}
);