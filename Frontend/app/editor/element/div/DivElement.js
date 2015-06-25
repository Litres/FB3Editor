/**
 * Элемент div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.div.DivElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.div.SplitCommand',
			'FBEditor.editor.command.div.CreateCommand',
			'FBEditor.editor.command.div.CreateRangeCommand',
			'FBEditor.editor.element.div.DivElementController'
		],
		controllerClass: 'FBEditor.editor.element.div.DivElementController',
		htmlTag: 'div',
		xmlTag: 'div',
		cls: 'el-div',
		permit: {
			splittable: true
		},

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Блок');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);