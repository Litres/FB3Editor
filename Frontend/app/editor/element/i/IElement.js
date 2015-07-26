/**
 * Алиас для элемента em.
 *
 * @alias FBEditor.editor.element.em.EmElement
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.i.IElement',
	{
		constructor: function ()
		{
			return Ext.create('FBEditor.editor.element.em.EmElement');
		}
	}
);