/**
 * Прокси для узла span.
 *
 * @singleton
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.dom.SpanProxy',
	{
		extend: 'FBEditor.editor.pasteproxy.dom.AbstractProxy',
		
		statics: {
			/**
			 * Возвращает объект.
			 * @param data
			 * @return {FBEditor.editor.pasteproxy.dom.SpanProxy}
			 */
			getImplementation: function (data)
			{
				var me = this,
					self;
				
				self = me.self || Ext.create('FBEditor.editor.pasteproxy.dom.SpanProxy', data);
				self.node = data.node;
				self.domProxy = data.domProxy;
				me.self = self;
				
				return self;
			},

			/**
			 * @private
			 * @property {FBEditor.editor.pasteproxy.dom.SpanProxy}
			 */
			self: null
		},
		
		/**
		 * @property {Object} Карта преобразований span к другим элементам, в зависимости от текущих CSS-стилей span.
		 * Каждая запись содержит ключ CSS-свойства, его значение и название элемента.
		 */
		mapStyle: {
			'font-weight': {
				bold: 'strong',
				'700': 'strong' // google doc
			},
			'font-style': {
				italic: 'em'
			},
			'text-decoration': {
				underline: 'underline',
				'none underline': 'underline',
				'line-through': 'strikethrough'
			},
			'letter-spacing': {
				pattern: /\d+(\.\d+)?(\w{2})/,
				el: 'spacing'
			}
		}
	}
);