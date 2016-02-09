/**
 * Элемент poem.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.poem.PoemElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.poem.CreateCommand',
			'FBEditor.editor.command.poem.CreateRangeCommand',
			'FBEditor.editor.element.poem.PoemElementController'
		],

		controllerClass: 'FBEditor.editor.element.poem.PoemElementController',
		htmlTag: 'poem',
		xmlTag: 'poem',
		cls: 'el-poem',

		isPoem: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.stanza = FBEditor.editor.Factory.createElement('stanza');
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Поэма');
			els.p.add(els.t);
			els.stanza.add(els.p);
			me.add(els.stanza);

			return els;
		},

		convertToText: function (fragment)
		{
			var me = this,
				factory = FBEditor.editor.Factory;

			// переносим из stanza всех потомков в p и добавляем во фрагмент
			Ext.Array.each(
				me.children,
				function (stanza)
				{
					var p = factory.createElement('p');

					Ext.Array.each(
						stanza.children,
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