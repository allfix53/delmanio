import React, { useRef } from 'react'
import { AutoSizer } from 'react-virtualized'
import { VariableSizeGrid as Grid } from 'react-window'
import Draggable from 'react-draggable'
import { FaGripLinesVertical } from 'react-icons/fa'
import { IoIosArrowDroprightCircle, IoIosCloseCircle } from 'react-icons/io'
import { Box } from '@chakra-ui/react'

class DefaultTable extends React.Component {
  constructor(props) {
    super(props)
    this.gridRef = React.createRef()
  }

  // get column name
  columns = Object.keys(this.props.data[0])

  // column width
  getInitialColumnWidths = () => {
    return Array(this.columns.length).fill(250)
  }
  calcHeaderWidth = () => {
    let width = 0
    this.getInitialColumnWidths().map((w) => {
      width += w
    })
    return width
  }

  state = {
    columnWidth: this.getInitialColumnWidths(),
    headerWidth: this.calcHeaderWidth(),
    openedShowMore: null,
  }

  Cell = ({ columnIndex, rowIndex, style }) => {
    const refItem = React.useRef()
    const content = this.props.data[rowIndex][this.columns[columnIndex]]
    return (
      <>
        <div style={{ ...style, marginTop: '35px' }} className="main-grid" ref={refItem}>
          {content}
          {/* Icon to open show more */}
          {content.length * 14 > this.state.columnWidth[columnIndex] && (
            <>
              <Box
                position="absolute"
                top={0}
                right={0}
                height={35}
                bgGradient="linear(to-r, rgba(255,255,255,0), white, white)"
                w="80px"
              />
              <IoIosArrowDroprightCircle
                size="24px"
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  color: 'GrayText',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  this.setState({
                    openedShowMore: `${columnIndex},${rowIndex}`,
                  })
                }
              />
            </>
          )}
        </div>

        {this.state.openedShowMore == `${columnIndex},${rowIndex}` && (
          <div
            style={{
              ...style,
              height: '100px',
              background: 'white',
              border: 'cyan 1px solid',
              padding: '5px',
              zIndex: 999,
              fontWeight: 'bold',
            }}
          >
            {/* Icon to close show more */}
            <Box
              bg="white"
              position="absolute"
              top={-13}
              right={-13}
              rounded="full"
            >
              <IoIosCloseCircle
                style={{
                  color: 'GrayText',
                  cursor: 'pointer',
                }}
                size="24px"
                onClick={() => this.setState({ openedShowMore: null })}
              />
            </Box>
            {this.props.data[rowIndex][this.columns[columnIndex]]}
          </div>
        )}
      </>
    )
  }

  render() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            ref={this.gridRef}
            columnCount={this.columns.length}
            columnWidth={(index) => this.state.columnWidth[index]}
            height={height}
            rowCount={this.props.data.length}
            rowHeight={() => 35}
            width={width}
            innerElementType={({ children }) => (
              <Box
                fontFamily="mono"
                className="grid-container"
                style={{
                  height: this.props.data.length * 35,
                }}
              >
                <div
                  className="header"
                  style={{ width: this.state.headerWidth }}
                >
                  {this.columns.map((colName, key) => (
                    <div
                      className="col"
                      key={`colHeader-${key}`}
                      style={{ width: this.state.columnWidth[key] }}
                    >
                      {colName}
                      <Draggable
                        axis="x"
                        onDrag={(event, { deltaX, deltaY }) => {
                          let prevWidths = this.state.columnWidth
                          prevWidths[key] = prevWidths[key] + deltaX
                        }}
                        onStop={(event, drag) => {
                          let prevWidths = this.state.columnWidth
                          prevWidths[key] = 250 + drag.x
                          this.setState({
                            columnWidth: prevWidths,
                            headerWidth: this.calcHeaderWidth(),
                          })

                          this.gridRef.current.resetAfterColumnIndex(key)
                        }}
                      >
                        <div className="hadle grid-draggable-handler">
                          <FaGripLinesVertical />
                        </div>
                      </Draggable>
                    </div>
                  ))}
                </div>
                <div>{children}</div>
              </Box>
            )}
          >
            {this.Cell}
          </Grid>
        )}
      </AutoSizer>
    )
  }
}

export default DefaultTable
