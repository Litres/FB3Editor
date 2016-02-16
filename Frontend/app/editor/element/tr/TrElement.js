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
			els.t = FBEditor.editor.Factory.createElementText('Строка');
			els.p.add(els.t);
			els.td.add(els.p);
			me.add(els.td);

			return els;
		},

		convertToText: function (fragment)
		{
			var me = this,
				factory = FBEditor.editor.Factory;

			// переносим из td всех потомков в p и добавляем во фрагмент
			Ext.Array.each(
				tr.children,
				function (td)
				{
					var p = factory.createElement('p');

					Ext.Array.each(
						td.children,
						function (child)
						{
							p.add(child);
						}
					);

					fragment.add(p);
				}
			);
		}
	}
);