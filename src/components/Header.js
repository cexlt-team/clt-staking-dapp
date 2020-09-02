import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import Logo from '../assets/images/clt-icon.png';
import Blockies from './Blockies';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: 0,
    paddingTop: 0,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 20px 0px',
    '@media (min-width: 280px) and (max-width: 480px)': {
      padding: '5px 5px 0px'
    }
  },
  logo: {
    width: 68,
    height: 68
  },
  address: {
    fontSize: 10,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

const Header = props => {
  const classes = useStyles();
  const { web3, address, onConnect } = props;

  return (
    <Box className={classes.root}>
      <div className={classes.navBar}>
        <Link href="https://cexlt.io">
          <img className={classes.logo} src={Logo} alt="clt icon" />
        </Link>
        { (web3 && address) ? (
          <Box>
            <Blockies address={address} size={12} />
            <div className={classes.address}>{address.substring(0, 6)}</div>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={onConnect}
          >
            Connect Account
          </Button>
        ) }
      </div>
    </Box>
  );
};

export default Header