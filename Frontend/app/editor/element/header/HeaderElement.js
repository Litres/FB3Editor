/**
 * Алиас для элемента title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.header.HeaderElement',
	{
		constructor: function ()
		{
			return Ext.create('FBEditor.editor.element.title.TitleElement');
		}
	}
);