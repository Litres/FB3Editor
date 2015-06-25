/**
 * Элемент title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.title.TitleElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.title.CreateCommand',
			'FBEditor.editor.element.title.TitleElementController'
		],
		controllerClass: 'FBEditor.editor.element.title.TitleElementController',
		htmlTag: 'header',
		xmlTag: 'title',
		cls: 'el-title',

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Заголовок');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);