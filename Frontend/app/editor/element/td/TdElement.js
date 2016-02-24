/**
 * Элемент td.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.td.TdElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			//'FBEditor.editor.command.td.CreateCommand',
			//'FBEditor.editor.command.td.CreateRangeCommand',
			'FBEditor.editor.element.td.TdElementController'
		],

		controllerClass: 'FBEditor.editor.element.td.TdElementController',
		htmlTag: 'td',
		xmlTag: 'td',
		cls: 'el-td',
		showedOnTree: false,

		isTd: true,
		isCell: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.br = FBEditor.editor.Factory.createElement('br');
			els.p.add(els.br);
			me.add(els.p);

			return els;
		},

		getXml: function ()
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			// заменяем первый br на пустой параграф согласно схеме
			xml = xml.replace(/<td><br\/>/gi, '<td><p></p>');

			return xml;
		}
	}
);