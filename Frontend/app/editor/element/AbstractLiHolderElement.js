/**
 * Абстрактный класс элементов содержащих элемент li.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractLiHolderElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		isLiHolder: true,

		getOnlyStylesChildren: function (fragment)
		{
			var me = this;

			// если в li содержится p, то переносим из p всех потомков в li
			Ext.Array.each(
				me.children,
				function (li)
				{
					var p = li.children[0];

					if (p.isP)
					{
						while (p.children.length)
						{
							li.add(p.children[0]);
						}
						li.remove(p);
					}
				}
			);

			fragment.add(me);
		},

		convertToText: function (fragment)
		{
			var me = this,
				factory = FBEditor.editor.Factory;

			// переносим из li всех потомков в p и добавляем во фрагмент
			Ext.Array.each(
				me.children,
				function (li)
				{
					var p = factory.createElement('p');

					Ext.Array.each(
						li.children,
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