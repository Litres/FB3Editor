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
			//'FBEditor.editor.command.poem.DeleteWrapperCommand',
			'FBEditor.editor.element.poem.PoemElementController'
		],

		controllerClass: 'FBEditor.editor.element.poem.PoemElementController',
		htmlTag: 'poem',
		xmlTag: 'poem',
		cls: 'el-poem',

		isPoem: true,

		/*getOnlyStylesChildren: function (fragment)
		{
			var me = this;

			// если в stanza содержится p, то переносим из p всех потомков в stanza
			Ext.Array.each(
				me.children,
				function (stanza)
				{
					var p = stanza.children[0];

					if (p.isP)
					{
						while (p.children.length)
						{
							stanza.add(p.children[0]);
						}
						stanza.remove(p);
					}
				}
			);

			fragment.add(me);
		},*/

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