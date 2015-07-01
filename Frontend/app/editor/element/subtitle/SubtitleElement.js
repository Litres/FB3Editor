/**
 * Элемент subtitle.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.subtitle.SubtitleElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'subtitle',
		xmlTag: 'subtitle',
		cls: 'el-subtitle',

		/**
		 * @property {Boolean} Стилевой ли элемент.
		 */
		isStyleType: true

	}
);