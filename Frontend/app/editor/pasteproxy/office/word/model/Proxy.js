/**
 * Прокси модели ms office word.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.office.word.model.Proxy',
	{
		extend: 'FBEditor.editor.pasteproxy.ModelProxyDefault',
		
		normalizeList: function (el)
		{
			var me = this,
				pasteProxy = me.pasteProxy,
				manager = pasteProxy.manager,
				factory = manager.getFactory(),
				els = {},
				attr,
				type,
				level;
			
			if (el.isLi && el.getAttributes('mso-list'))
			{
				// конвертируем список li в список
				
				attr = el.getAttributes('mso-list');
				el.removeAttributes('mso-list');
				attr = attr.match(/l([0-1]) level([0-9]+)/);
				type = Number(attr[1]);
				level = Number(attr[2]);
				
				els.parent = el.getParent();
				els.next = el.next();
				els.prev = el.prev();
				
				// уровень вложенности списка
				els.msoLevel = els.prev && els.prev.isLiHolder && els.prev._msoLevel ?
					els.prev._msoLevel : false;
				
				//console.log('li', [type, level, els.msoLevel]);
				
				if (els.msoLevel)
				{
					// существующий список
					els.liHolder = els.prev;
					
					els.isInner = false;
					
					if (els.msoLevel !== level)
					{
						// вложенный список
						els.last = els.liHolder.last();
						els.last = els.last && els.last.isLiHolder ? els.last : false;
						
						while (els.last)
						{
							els.liHolder = els.last;
							
							if (level === els.liHolder._msoLevel)
							{
								// вложенный список нужного уровня
								els.isInner = true;
								break;
							}
							
							// вложенный список
							els.last = els.last.last();
							els.last = els.last && els.last.isLiHolder ? els.last : false;
						}
						
						if (!els.isInner)
						{
							els.parentLiHolder = els.liHolder;
							
							//создаем вложенный список
							els.liHolder = factory.createElement(type ? 'ol' : 'ul');
							
							// уровень вложенности списка
							els.liHolder._msoLevel = level;
							
							els.parentLiHolder.add(els.liHolder);
						}
					}
				}
				else
				{
					// создаем список
					els.liHolder = factory.createElement(type ? 'ol' : 'ul');
					
					// уровень вложенности списка
					els.liHolder._msoLevel = level;
					
					if (els.next)
					{
						els.parent.insertBefore(els.liHolder, els.next);
					}
					else
					{
						els.parent.add(els.liHolder);
					}
				}
				
				// переносим li в список
				els.liHolder.add(el);
				
				me.normalizeElement(els.parent);
			}
			else
			{
				me.callParent(arguments);
			}
		}
	}
);