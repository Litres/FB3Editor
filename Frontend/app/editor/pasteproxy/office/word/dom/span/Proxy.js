/**
 * Прокси для узла span.
 *
 * @singleton
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.office.word.dom.span.Proxy',
	{
		extend: 'FBEditor.editor.pasteproxy.dom.SpanProxy',
		
		statics: {
			/**
			 * Возвращает объект.
			 * @param data
			 * @return {FBEditor.editor.pasteproxy.office.word.dom.span.Proxy}
			 */
			getImplementation: function (data)
			{
				var me = this,
					self;
				
				self = me.self || Ext.create('FBEditor.editor.pasteproxy.office.word.dom.span.Proxy', data);
				self.node = data.node;
				self.domProxy = data.domProxy;
				me.self = self;
				
				return self;
			},
			
			/**
			 * @private
			 * @property {FBEditor.editor.pasteproxy.office.word.dom.span.Proxy}
			 */
			self: null
		}
	}
);