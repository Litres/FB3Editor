/**
 * Элемент notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.notebody.NotebodyElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.notebody.CreateCommand',
			'FBEditor.editor.element.notebody.NotebodyElementController'
		],
		controllerClass: 'FBEditor.editor.element.notebody.NotebodyElementController',
		htmlTag: 'notebody',
		xmlTag: 'notebody',
		cls: 'el-notebody',
		permit: {
			splittable: true
		},

		isNotebody: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Сноска');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);