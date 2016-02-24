/**
 * Элемент tr.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.tr.TrElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			//'FBEditor.editor.command.tr.CreateCommand',
			//'FBEditor.editor.command.tr.CreateRangeCommand',
			'FBEditor.editor.element.tr.TrElementController'
		],

		controllerClass: 'FBEditor.editor.element.tr.TrElementController',
		htmlTag: 'tr',
		xmlTag: 'tr',
		cls: 'el-tr',
		showedOnTree: false,

		isTr: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.td = FBEditor.editor.Factory.createElement('td');
			els.p = FBEditor.editor.Factory.createElement('p');
			els.br = FBEditor.editor.Factory.createElement('br');
			els.p.add(els.br);
			els.td.add(els.p);
			me.add(els.td);

			return els;
		}
	}
);