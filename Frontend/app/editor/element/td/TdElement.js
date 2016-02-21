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
			els.t = FBEditor.editor.Factory.createElementText(' ');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		},

		convertToText: function (fragment)
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				p;

			// переносим из td всех потомков в p и добавляем во фрагмент
			p = factory.createElement('p');

			Ext.Array.each(
				td.children,
				function (child)
				{
					p.add(child);
				}
			);

			fragment.add(p);
		}
	}
);