/**
 * Таблица преобразований XSLT для схемы тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.xsl.SchemaBody',
	{
		singleton: true,

		/**
		 * Вовзращает xsl для преобразования xml в json.
		 * @return {String} Строка xsl
		 */
		getXsl: function ()
		{
			var xsl;

			xsl = '\
<?xml version="1.0" encoding="UTF-8"?>\
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">\
	<xsl:output encoding="UTF-8" indent="no" method="html"/>\
	<xsl:template match="/">\
		<xsl:call-template name="types"/>\
		elements = {\
		<xsl:for-each select=".//element">\
			<xsl:variable name="elementName" select="@name"/>\
			<xsl:if test="not(preceding::element[@name=$elementName]) and $elementName">\
				<xsl:if test="position()!=1">,</xsl:if>\
				\'<xsl:value-of select="$elementName"/>\': cse(\'<xsl:value-of select="$elementName"/>\', {\
				<xsl:call-template name="elements">\
					<xsl:with-param name="typeName" select="@type"/>\
					<xsl:with-param name="parentName" select="$elementName"/>\
				</xsl:call-template>\
				, attributes: {<xsl:if test="@*"><xsl:apply-templates select="@*"/></xsl:if>}\
				})\
			</xsl:if>\
		</xsl:for-each>};\
	</xsl:template>\
	\
	<xsl:template match="@*">\'<xsl:value-of select="local-name()"/>\': \'<xsl:value-of select="."/>\'<xsl:if test="position()!=last()">, </xsl:if></xsl:template>\
	\
	<xsl:template name="elements">\
		<xsl:param name="typeName"/>\
		<xsl:param name="parentName"/>\
		extend: \'<xsl:if test="$typeName">FBEditor.schema.body.</xsl:if><xsl:value-of select="substring-after($typeName, \'fb3b:\')"/><xsl:call-template name="extended"/>\'\
		<xsl:if test="count(.//element)">\
			, elements: {\
			<xsl:for-each select=".//element">\
				<xsl:variable name="elementName" select="@name"/>\
				<xsl:if test="not($elementName=\'note\' and $parentName=\'fb3-body\')">\
					<xsl:call-template name="element">\
						<xsl:with-param name="attributes" select="@*"/>\
						<xsl:with-param name="elementName" select="$elementName"/>\
						<xsl:with-param name="pos" select="position()"/>\
					</xsl:call-template>\
				</xsl:if>\
			</xsl:for-each>\
			}\
		</xsl:if>\
	</xsl:template>\
	\
	<xsl:template name="element">\
		<xsl:variable name="elementName">\
			<xsl:choose>\
				<xsl:when test="@name"><xsl:value-of select="@name"/></xsl:when>\
				<xsl:when test="@ref"><xsl:value-of select="@ref"/></xsl:when>\
				<xsl:otherwise><xsl:text>undefined</xsl:text></xsl:otherwise>\
			</xsl:choose>\
		</xsl:variable>\
		<xsl:if test="position()!=1">,</xsl:if>\
		\'<xsl:value-of select="$elementName"/>\': {<xsl:if test="@*"><xsl:apply-templates select="@*"/></xsl:if>}\
	</xsl:template>\
	\
	<xsl:template name="extended">\
		<xsl:for-each select="descendant::extension">\
			<xsl:if test="position()=1">FBEditor.schema.body.<xsl:value-of select="substring-after(@base, \'fb3b:\')"/></xsl:if>\
		</xsl:for-each>\
	</xsl:template>\
	\
	<xsl:template name="types">\
		<xsl:for-each select="schema/complexType">\
			<xsl:variable name="seqEls" select="sequence/element" />\
			<xsl:variable name="extEls" select="complexContent/extension/sequence/element" />\
			<xsl:variable name="attrs" select="attribute" />\
			<xsl:variable name="extAttrs" select="complexContent/extension/attribute" />\
			Ext.define(\'FBEditor.schema.body.<xsl:value-of select="@name"/>\', {\
				<xsl:if test="count(complexContent/extension)">\
					extend: \'FBEditor.schema.body.<xsl:value-of select="substring-after(complexContent/extension/@base, \'fb3b:\')"/>\'\
				</xsl:if>\
				<xsl:if test="count($extEls) or count($seqEls)">\
					<xsl:if test="count(complexContent/extension)">,</xsl:if>\
					elements: {\
					<xsl:for-each select="$extEls"><xsl:call-template name="element"/></xsl:for-each>\
					<xsl:for-each select="$seqEls"><xsl:call-template name="element"/></xsl:for-each>\
				}</xsl:if>\
				<xsl:if test="count(sequence/choice)">\
					<xsl:if test="count(complexContent/extension) or count($extEls) or count($seqEls)">,</xsl:if>\
					choice: {<xsl:call-template name="choice"/>}\
				</xsl:if>\
				<xsl:if test="count($extAttrs) or count($attrs)">\
					<xsl:if test="count(complexContent/extension) or count($extEls) or count($seqEls) or count(sequence/choice)">,</xsl:if>\
					attributes: {\
					<xsl:for-each select="$extAttrs"><xsl:if test="position()!=1">,</xsl:if><xsl:call-template name="attribute"/></xsl:for-each>\
					<xsl:for-each select="$attrs"><xsl:if test="position()!=1 or count($extAttrs)">,</xsl:if><xsl:call-template name="attribute"/></xsl:for-each>\
				}</xsl:if>\
			});\
		</xsl:for-each>\
		<xsl:for-each select="schema/simpleType">\
			Ext.define(\'FBEditor.schema.body.<xsl:value-of select="@name"/>\', {\
				<xsl:call-template name="restriction"><xsl:with-param name="rest" select="restriction"/></xsl:call-template>\
			});\
		</xsl:for-each>\
	</xsl:template>\
	\
	<xsl:template name="attribute">\
		<xsl:variable name="attrName">\
			<xsl:choose>\
				<xsl:when test="@name"><xsl:value-of select="@name"/></xsl:when>\
				<xsl:when test="@ref"><xsl:value-of select="@ref"/></xsl:when>\
				<xsl:otherwise><xsl:text>undefined</xsl:text></xsl:otherwise>\
			</xsl:choose>\
		</xsl:variable>\
		\'<xsl:value-of select="$attrName"/>\': {<xsl:apply-templates select="@*"/>}\
		<xsl:if test="simpleType/restriction">, restriction: {<xsl:call-template name="restriction"><xsl:with-param name="rest" select="simpleType/restriction"/></xsl:call-template>}</xsl:if>\
	</xsl:template>\
	\
	<xsl:template name="restriction">\
		<xsl:param name="rest"/>\
		<xsl:variable name="enums" select="$rest/enumeration"/>\
		base: \'<xsl:value-of select="$rest/@base"/>\',\
		<xsl:if test="$enums">\
			enumeration: [\
			<xsl:for-each select="$enums">\
				<xsl:if test="position()!=1">,</xsl:if>\
				\'<xsl:value-of select="@value"/>\'\
			</xsl:for-each>\
		]</xsl:if>\
		<xsl:if test="$rest/pattern">pattern: \'<xsl:value-of select="$rest/pattern/@value"/>\'</xsl:if>\
		<xsl:if test="$rest/minInclusive">minInclusive: \'<xsl:value-of select="$rest/minInclusive/@value"/>\'</xsl:if>\
		<xsl:if test="$rest/maxInclusive"><xsl:if test="$rest/minInclusive">,</xsl:if> maxInclusive: \'<xsl:value-of select="$rest/maxInclusive/@value"/>\'</xsl:if>\
	</xsl:template>\
	\
	<xsl:template name="choice">\
		<xsl:if test="sequence/choice/@*">attributes: {<xsl:apply-templates select="sequence/choice/@*"/>},</xsl:if>\
		elements: {\
		<xsl:for-each select="sequence/choice/element">\
			<xsl:call-template name="element">\
				<xsl:with-param name="attributes" select="@*"/>\
				<xsl:with-param name="elementName" select="@name"/>\
				<xsl:with-param name="pos" select="position()"/>\
			</xsl:call-template>\
		</xsl:for-each>\
		}\
	</xsl:template>\
</xsl:stylesheet>\
			';

			return xsl;
		}
	}
);