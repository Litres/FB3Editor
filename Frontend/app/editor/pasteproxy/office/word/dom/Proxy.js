/**
 * DOM-прокси для источника Office Word.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.office.word.dom.Proxy',
	{
		extend: 'FBEditor.editor.pasteproxy.DomProxyDefault',
		requires: [
			'FBEditor.editor.pasteproxy.office.word.dom.p.Proxy',
			'FBEditor.editor.pasteproxy.office.word.dom.span.Proxy'
		],
		
		msoAttributes: {
			'li': [
				{
					name: 'mso-list',
					val: null
				}
			]
		},
		
		convertSpan: function (node)
		{
			var me = this,
				proxy,
				name;
			
			proxy = FBEditor.editor.pasteproxy.office.word.dom.span.Proxy.getImplementation({node: node, domProxy: me});
			me.setNodeProxy(proxy);
			name = proxy.getNewName();
			
			return name;
		},
		
		convertP: function (node)
		{
			var me = this,
				styles,
				proxy,
				name;
			
			proxy = FBEditor.editor.pasteproxy.office.word.dom.p.Proxy.getImplementation({node: node, domProxy: me});
			me.setNodeProxy(proxy);
			name = proxy.getNewName();
			styles = proxy.getStyles();
			
			Ext.Array.each(
				me.msoAttributes[name],
				function (item)
				{
					var val = styles[item.name];
					
					if (val)
					{
						item.val = val;
					}
				}
			);
			
			return name;
		},
		
		getAttributes: function (node, elementSchema)
		{
			var me = this,
				nodeProxy = me.getNodeProxy(),
				name,
				attributes;
			
			attributes = me.callParent(arguments);

			if (nodeProxy)
			{
				name = nodeProxy.getName();
				
				Ext.Array.each(
					me.msoAttributes[name],
					function (item)
					{
						attributes[item.name] = item.val;
					}
				);
			}
			
			return attributes;
		}
	}
);