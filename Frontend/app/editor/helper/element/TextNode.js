/**
 * Хэлпер для работы с отображением текстового элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.helper.element.TextNode',
	{
		extend: 'FBEditor.editor.helper.element.Node',
		
		/**
		 * @private
		 * @property {Node[]} Ссылки на узлы с подсветкой.
		 */
		overlays: null,
		
		scrollIntoView: function ()
		{
			var me = this,
				el = me.el,
				parent,
				helper;
			
			// так как текстовый элемент не может быть прокручен, то передаем управление родительскому элементу
			parent = el.getParent();
			helper = parent.getNodeHelper();
			helper.scrollIntoView();
		},
		
		/**
		 * Добавляет подсветку в текст.
		 * Реализуется путем разделения текста в начальной и конечной точках выделения,
		 * и переноса выделяемой части текста в создаваемый узел overlay, который может иметь свой css-класс.
		 * @param {Object[]} pos Позиция подсветки.
		 * @param {Number} pos.start Начальная позиция.
		 * @param {Number} pos.end Конечная позиция.
		 * @param {Boolean} pos.selection Выделить ли подсветку.
		 * @param {String} cls CSS-класс подсветки.
		 */
		addOverlay: function (pos, cls)
		{
			var me = this,
				el = me.el,
				node = me.getNode(),
				manager = el.getManager(),
				nodes = {},
				tokens = [],
				text;
			
			text = el.getText();
			
			// разбиваем текст на токены
			Ext.each(
				pos,
				function (item, index)
				{
					var start = item.start,
						end = item.end,
						selection = item.selection,
						token,
						nextToken,
						str;
					
					if (index === 0 && start !== 0)
					{
						// добавляем первую часть текста
						str = text.substring(0, start);
						token = {
							overlay: false,
							str: str
						};
						tokens.push(token);
					}
					
					str = text.substring(start, end);
					token = {
						overlay: true,
						str: str,
						selection: selection
					};
					tokens.push(token);
					
					nextToken = index + 1 < pos.length ? pos[index + 1] : false;
					
					if (end !== text.length)
					{
						// добавляем следующую часть текста
						
						start = end;
						end = nextToken ? nextToken.start : text.length;
						str = text.substring(start, end);
						token = {
							overlay: false,
							str: str
						};
						tokens.push(token);
					}
				}
			);
			
			// временный фрагмент
			nodes.fragment = document.createDocumentFragment();
			nodes.wrap = document.createElement('overlay-wrap');
			nodes.wrap.getElement = function () {return el;};
			
			Ext.each(
				tokens,
				function (token)
				{
					var text = token.str,
						overlay = token.overlay,
						selection = token.selection,
						overlayCls;
					
					nodes.t = document.createTextNode(text);
					nodes.t.getElement = function () {return el;};
					
					if (overlay)
					{
						overlayCls = selection ? cls + '-selection' : cls;
						nodes.overlay = document.createElement('overlay');
						nodes.overlay.getElement = function () {return el;};
						nodes.overlay.setAttribute('class', overlayCls);
						nodes.overlay.appendChild(nodes.t);
						nodes.wrap.appendChild(nodes.overlay);
					}
					else
					{
						nodes.wrap.appendChild(nodes.t);
					}
				}
			);
			
			nodes.fragment.appendChild(nodes.wrap);
			
			// сохраняем ссылку на текущий оверлей
			me.overlays = me.overlays || [];
			me.overlays[cls] = nodes.wrap;
			
			manager.setSuspendEvent(true);
			
			// временно скрываем текущий текст
			node.nodeValue = '';

			// показываем фрагмент в редакторе
			nodes.parent = node.parentNode;
			nodes.parent.insertBefore(nodes.fragment, node);
			
			manager.setSuspendEvent(false);
		},
		
		/**
		 * Удаляет подсветку текста.
		 * @param {String} cls CSS-класс подсветки.
		 */
		removeOverlay: function (cls)
		{
			var me = this,
				el = me.el,
				overlay = me.overlays[cls],
				node = me.getNode(),
				manager = el.getManager(),
				nodes = {};
			
			if (overlay)
			{
				manager.setSuspendEvent(true);
				
				// показываем текст
				node.nodeValue = el.getText();
				
				// удаляем подсветку
				nodes.parent = node.parentNode;
				nodes.parent.removeChild(overlay);
				
				manager.setSuspendEvent(false);
				
				delete me.overlays[cls];
			}
		},
		
		/**
		 * Возвращает реальное смещение с учетом оверлея.
		 * @param {Node} node Узел.
		 * @param {Number} offset Смещение в узле.
		 * @return {Number} Реальное смещение.
		 */
		getOffset: function (node, offset)
		{
			var me = this,
				overlays = me.overlays,
				realOffset = offset;
			
			if (overlays)
			{
				realOffset = 0;
				
				// перебираем все обертки-оверлеи
				Ext.Object.each(
					overlays,
					function (key, wrap)
					{
						var res;
						
						// перебираем все дочерние элементы обертки-оверлея
						res = Ext.each(
							wrap.childNodes,
							function (token)
							{
								var length,
									text;
								
								if (token.contains(node))
								{
									return false;
								}
								
								text = token.innerHTML || token;
								length = text.length;
								realOffset += length;
								//console.log('token', token, text, length);
							}
						);
						
						if (res !== true)
						{
							return false;
						}
					}
				);
				
				realOffset += offset;
			}
			
			return realOffset;
		}
	}
);