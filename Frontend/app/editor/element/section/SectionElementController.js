/**
 * Кнотроллер элемента section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.section.SectionElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var range;

			// получаем данные из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);

			// вложенную секцию всегда можно создать из любой позиции курсора в тексте
			return range.startContainer;
		}
	}
);