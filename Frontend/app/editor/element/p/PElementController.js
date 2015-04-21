/**
 * Кнотроллер элемента p.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.p.PElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onKeyDownEnter: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent,
				next,
				startText,
				endText,
				p;

			if (sel.type === 'Caret')
			{
				range = sel.getRangeAt(0);
				node = range.endContainer;
				parent = node.parentNode;
				e.preventDefault();
				if (node.nodeType === Node.TEXT_NODE)
				{
					startText = range.startOffset ?
					            document.createTextNode(node.nodeValue.substring(0, range.startOffset)) :
					            document.createElement('br');
					endText = range.startOffset !== node.length ?
					          document.createTextNode(node.nodeValue.substring(range.startOffset)) :
					          document.createElement('br');
					p = document.createElement('p');
					parent.parentNode.insertBefore(p, parent);
					p.appendChild(startText);
					parent.replaceChild(endText, node);
					sel.collapse(parent);
				}
				else
				{
					next = node.nextSibling;
					console.log('enter', node, next, parent);
					p = document.createElement('p');
					if (next)
					{
						parent.insertBefore(p, next);
					}
					else
					{
						parent.appendChild(p);
					}
					p.appendChild(document.createElement('br'));
					sel.collapse(p);
				}

				return false;
			}

			return true;
		},

		onKeyDownDelete: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent,
				next;

			if (sel.type === 'Caret')
			{
				range = sel.getRangeAt(0);
				node = range.startContainer;
				parent = node.parentNode;
				next = node.nextSibling;
				//console.log('P node', node);
				if (next && node.firstChild.nodeName === 'BR' && node.childNodes.length === 1)
				{
					e.preventDefault();
					parent.removeChild(node);
					sel.collapse(next);
				}
				else
				{
					me.callParent(arguments);
				}

				return false;
			}

			return true;
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				range,
				node,
				parent,
				prev;

			if (sel.type === 'Caret')
			{
				range = sel.getRangeAt(0);
				node = range.startContainer;
				parent = node.parentNode;
				prev = node.previousSibling;
				//console.log('P node', node);
				if (prev && node.firstChild.nodeName === 'BR' && node.childNodes.length === 1)
				{
					e.preventDefault();
					parent.removeChild(node);
					sel.extend(prev, prev.length);
					sel.collapseToEnd();
				}
				else
				{
					me.callParent(arguments);
				}

				return false;
			}

			return true;
		}
	}
);